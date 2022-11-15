import mongoose from 'mongoose';

const otpSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    otpToken: { type: Number },
  },
  { timestamps: true }
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 10 });

const otpToken = mongoose.model('OtpToken', otpSchema);

export default otpToken;
