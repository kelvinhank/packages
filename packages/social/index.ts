import { FacebookService } from './service/facebookService';

async function run() {
  // Sử dụng token truy cập thực tế của người dùng
  const accessToken = 'YOUR_ACCESS_TOKEN'; 

  const facebookService = new FacebookService(accessToken);

  try {
   console.log("xin chao");
   
    // Kiểm tra trạng thái đăng nhập
    const loginStatus = await facebookService.checkLoginStatus();
    console.log('Login status:', loginStatus);

    // Lấy thông tin người dùng
    const userDetails = await facebookService.getUserDetails();
    console.log('User details:', userDetails);

    // Đăng tin lên Facebook
    const postResponse = await facebookService.postMessage('Hello from Node.js!');
    console.log('Post response:', postResponse);

    // Lấy danh sách bạn bè
    const friends = await facebookService.getFriends();
    console.log('Friends:', friends);

  } catch (error:any) {
    console.error('Error:', error.message);
  }
}

run();
