import { post } from "../app/apiManager";


class UserService {

  static async userLogin(email, password) {
    const response = await post({
      path: "/user/login-student",
      requestBody: {
        email: email,
        password: password,
      },
    });
    return response;
  }





}

export default UserService;


