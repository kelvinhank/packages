import axios from 'axios';

export class FacebookService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Kiểm tra trạng thái đăng nhập
   */
  async checkLoginStatus(): Promise<any> {
    try {
      const response = await axios.get(`https://graph.facebook.com/me?access_token=${this.accessToken}`);
      return response.data;
    } catch (error:any) {
      throw new Error('Error checking login status: ' + error.message);
    }
  }

  /**
   * Đăng nhập với các quyền cụ thể (Chỉ có thể làm điều này với OAuth)
   * Trong môi trường Node.js, bạn sẽ cần có một token truy cập
   * @param scope Danh sách quyền (vd: email, public_profile)
   */
  async login(scope: string = "public_profile,email"): Promise<any> {
    // Để đăng nhập, bạn cần thực hiện quy trình OAuth, điều này yêu cầu một giao diện web
    throw new Error('Login not supported in Node.js, please use OAuth process.');
  }

  /**
   * Đăng xuất khỏi Facebook (Xóa token)
   */
  async logout(): Promise<void> {
    try {
      const response = await axios.post(`https://graph.facebook.com/logout?access_token=${this.accessToken}`);
      if (response.data.success) {
        console.log('Logged out successfully');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error:any) {
      throw new Error('Error logging out: ' + error.message);
    }
  }

  /**
   * Lấy thông tin người dùng
   */
  async getUserDetails(): Promise<any> {
    try {
      const response = await axios.get(`https://graph.facebook.com/me?access_token=${this.accessToken}&fields=id,name,email`);
      return response.data;
    } catch (error:any) {
      throw new Error('Error fetching user details: ' + error.message);
    }
  }

  /**
   * Đăng một tin nhắn lên Facebook
   * @param message Tin nhắn cần đăng
   */
  async postMessage(message: string): Promise<any> {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/me/feed`,
        {
          message,
          access_token: this.accessToken,
        }
      );
      return response.data;
    } catch (error:any) {
      throw new Error('Error posting message: ' + error.message);
    }
  }

  /**
   * Lấy tất cả bạn bè của người dùng
   */
  async getFriends(): Promise<any> {
    try {
      const response = await axios.get(`https://graph.facebook.com/me/friends?access_token=${this.accessToken}`);
      return response.data;
    } catch (error:any) {
      throw new Error('Error fetching friends: ' + error.message);
    }
  }
}
