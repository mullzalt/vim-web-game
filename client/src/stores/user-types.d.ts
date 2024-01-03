export interface UserData {
  id: string;
  email: string;
  Profile: {
    id: string;
    userId: string;
    username: string;
    photo: string;
    exp: number;
    totalScore: number;
    totalGrade: number;
  };
}
