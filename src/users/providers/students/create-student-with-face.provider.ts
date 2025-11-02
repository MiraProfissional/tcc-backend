import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStudentDto } from 'src/users/dtos/students/create-student.dto';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import { DataSource, Repository } from 'typeorm';
import { TeachersService } from '../teachers/teachers.service';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';
import { Upload } from 'src/uploads/upload.entity';
import { fileTypes } from 'src/uploads/enums/file-types.enum';
import { ConfigType } from '@nestjs/config';
import uploadFaceApiConfig from 'src/uploads/config/uploadFaceApi.config';
import * as path from 'path';
import { v4 as uuid4 } from 'uuid';
import * as FormData from 'form-data';
import axios from 'axios';

@Injectable()
export class CreateStudentWithFaceProvider {
  private readonly logger = new Logger(CreateStudentWithFaceProvider.name);

  constructor(
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    private readonly mailService: MailService,

    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,

    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,

    @Inject(forwardRef(() => TeachersService))
    private readonly teachersService: TeachersService,

    @Inject(uploadFaceApiConfig.KEY)
    private readonly uploadFaceApiConfiguration: ConfigType<
      typeof uploadFaceApiConfig
    >,

    private readonly dataSource: DataSource,
  ) {}

  /**
   * Creates a student with face image upload in a single transaction.
   * If the face upload to Python backend fails, the student creation is rolled back.
   */
  public async createStudentWithFace(
    createStudentDto: CreateStudentDto,
    faceImage: Express.Multer.File,
  ): Promise<Student> {
    if (!faceImage) {
      throw new BadRequestException(
        'Face image is required to create a student account.',
      );
    }

    // Start a database transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Step 1: Validate uniqueness (email, cpf, registrationNumber)
      await this.validateStudentUniqueness(createStudentDto);

      // Step 2: Create student entity (not saved yet, within transaction)
      const hashedPassword = await this.hashingProvider.hashPassword(
        createStudentDto.password,
      );

      const newStudent = this.studentsRepository.create({
        ...createStudentDto,
        password: hashedPassword,
      });

      // Save student to database (within transaction)
      await queryRunner.manager.save(newStudent);
      this.logger.log(`Student created with id=${newStudent.id}`);

      // Step 3: Generate filename and send image to Python Face Recognition backend
      const newFileName = this.generateFileName(faceImage, newStudent);

      const apiLink = this.uploadFaceApiConfiguration.userFaceApiLink;
      if (!apiLink) {
        throw new InternalServerErrorException(
          'Face Recognition API is not configured.',
        );
      }

      const formData = new FormData();
      formData.append('file', faceImage.buffer, {
        filename: newFileName,
        contentType: faceImage.mimetype,
      });

      this.logger.log(
        `Sending face image to Python backend: ${apiLink} with filename=${newFileName}`,
      );

      try {
        await axios.post(apiLink, formData, {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 30000,
        });
        this.logger.log('Face image successfully sent to Python backend');
      } catch (error) {
        this.logger.error(
          `Failed to send face image to Python backend: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        throw new RequestTimeoutException(
          'Failed to upload face image to face recognition system. Student creation aborted.',
        );
      }

      // Step 4: Create upload record in database (within transaction)
      const upload = this.uploadRepository.create({
        name: newFileName,
        type: fileTypes.IMAGE,
        student: newStudent,
      });

      await queryRunner.manager.save(upload);
      this.logger.log(`Upload record created with id=${upload.id}`);

      // Step 5: Commit transaction (everything succeeded)
      await queryRunner.commitTransaction();
      this.logger.log(
        `Transaction committed successfully for student id=${newStudent.id}`,
      );

      // Step 6: Send welcome email (outside transaction, non-critical)
      this.sendWelcomeEmailAsync(newStudent);

      return newStudent;
    } catch (error) {
      // Rollback transaction on any error
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Transaction rolled back due to error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      // Re-throw the error
      if (
        error instanceof BadRequestException ||
        error instanceof RequestTimeoutException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to create student with face image. Please try again.',
      );
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  /**
   * Validates that email, CPF, and registration number are unique
   */
  private async validateStudentUniqueness(
    createStudentDto: CreateStudentDto,
  ): Promise<void> {
    // Check email uniqueness (students)
    const existingStudentEmail = await this.studentsRepository.findOne({
      where: { email: createStudentDto.email },
    });

    if (existingStudentEmail) {
      throw new BadRequestException(
        'The email is already in use by another student.',
      );
    }

    // Check email uniqueness (teachers)
    const existingTeacherEmail =
      await this.teachersService.findOneTeacherByEmail(createStudentDto.email);

    if (existingTeacherEmail) {
      throw new BadRequestException(
        'The email is already in use by a teacher.',
      );
    }

    // Check CPF uniqueness (students)
    const existingStudentCpf = await this.studentsRepository.findOne({
      where: { cpf: createStudentDto.cpf },
    });

    if (existingStudentCpf) {
      throw new BadRequestException(
        'The CPF is already in use by another student.',
      );
    }

    // Check CPF uniqueness (teachers)
    const existingTeacherCpf = await this.teachersService.findOneTeacherByCpf(
      createStudentDto.cpf,
    );

    if (existingTeacherCpf) {
      throw new BadRequestException('The CPF is already in use by a teacher.');
    }

    // Check registration number uniqueness (students)
    const existingStudentRegistrationNumber =
      await this.studentsRepository.findOne({
        where: { registrationNumber: createStudentDto.registrationNumber },
      });

    if (existingStudentRegistrationNumber) {
      throw new BadRequestException(
        'The registration number is already in use by another student.',
      );
    }

    // Check registration number uniqueness (teachers)
    const existingTeacherRegistrationNumber =
      await this.teachersService.findOneTeacherByRegistrationNumber(
        createStudentDto.registrationNumber,
      );

    if (existingTeacherRegistrationNumber) {
      throw new BadRequestException(
        'The registration number is already in use by a teacher.',
      );
    }
  }

  /**
   * Generates a unique filename for the face image
   */
  private generateFileName(
    file: Express.Multer.File,
    user: Student | Teacher,
  ): string {
    const name = `${user.registrationNumber}-${user.firstName}-${user.lastName}`
      .replace(/\s/g, '')
      .trim();
    const extension = path.extname(file.originalname);
    const timestamp = new Date().getTime().toString().trim();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return `${name}-${timestamp}-${uuid4()}${extension}`;
  }

  /**
   * Sends welcome email asynchronously (non-blocking, non-critical)
   */
  private sendWelcomeEmailAsync(student: Student): void {
    this.mailService
      .sendWelcomeEmail(student)
      .then(() => {
        this.logger.log(`Welcome email sent to ${student.email}`);
      })
      .catch((error) => {
        this.logger.error(
          `Failed to send welcome email to ${student.email}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      });
  }
}
