import mongoose from 'mongoose';

const InvestorSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: String,
    gender: String,
    dob: String,
    age: Number,
    occupation: {
      type: String,
      default: 'business owner',
      enum: [
        'business owner',
        'professional',
        'angel network',
        'family office',
        'startup founder',
        'incubator',
        'student',
        'other',
      ],
      required: true,
    },
    budget: {
      type: Number,
      default: 0,
      required: true,
    },
    addr: {
      state: String,
      city: String,
      locality: String,
      pincode: Number,
      location: {
        lat: Number,
        lon: Number,
      },
    },
    gstin: Number,
    certificates: {
      photoID: {
        pdfDoc: {
          type: String,
          enum: [
            'AadharUID',
            'ElectionCommission',
            'Pan',
            'Passport',
            'Ration',
          ],
        },
        url: String,
        verified: {
          type: Boolean,
          default: false,
        },
        rejected: Boolean,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Investor = mongoose.model('Investor', InvestorSchema);

export default Investor;
