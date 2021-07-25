import User from '../User';

export default interface IGETUserAuthenticateDTO {
  user: User;
  token: string;
}
