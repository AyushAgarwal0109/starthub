import crypto from 'crypto';

class OtpService {
  static generateOtp() {
    const otp = crypto.randomInt(100000, 999999);
    return otp;
  }

  static verifyOtp(dbOtp, userOtp) {
    return dbOtp === userOtp;
  }

  static generateHashData(contact, otp) {
    const ttl = 1000 * 60 * 2;
    const expires = Date.now() + ttl;
    const data = `${phoneNo}.${otp}.${expires}`;
  }

  static hashOtp(data) {
    return crypto.createHmac('sha256', HASH_SECRET).update(data).digest('hex');
  }
}

export default OtpService;
