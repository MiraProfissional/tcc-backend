export interface StopFaceRecognitionInterface {
  stopped: boolean;
  discipline_id: number;
  recognized_faces?: (string | number)[];
  start_time: string;
  stop_time: string;
}
