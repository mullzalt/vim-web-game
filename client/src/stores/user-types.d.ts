export interface UserData {
  id: string;
  email: string;
  role: "user" | "admin";
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
