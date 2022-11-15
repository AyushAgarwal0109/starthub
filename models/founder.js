import mongoose from 'mongoose';

const FounderSchema = mongoose.Schema(
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

const Founder = mongoose.model('Founder', FounderSchema);

export default Founder;
