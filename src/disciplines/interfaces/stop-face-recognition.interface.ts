export interface StopFaceRecognitionInterface {
  success?: boolean;
  message?: string;
  discipline_id?: number;
  camera?: string | number;
  start_time: string;
  stop_time: string;
  duration_seconds?: number;
  faces_recognized?: (string | number)[];
  total_unique_faces?: number;
  recognized_faces?: (string | number)[];
  stopped?: boolean;
}
