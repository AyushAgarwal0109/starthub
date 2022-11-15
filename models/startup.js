import mongoose from 'mongoose';

const StartupSchema = mongoose.Schema(
  {
    founder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Founder',
      required: true,
    },
    investors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investor',
      },
    ],
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    phone: String,
    inceptionDate: {
      type: String,
      required: true,
    },
    existenceYears: Number,
    type: {
      type: String,
      default: 'private limited company',
      enum: [
        'private limited company',
        'registered partnership firm',
        'limited liability partnership',
      ],
      required: true,
    },
    sector: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      default: 'idea stage',
      enum: [
        'idea stage',
        'proof of concept',
        'beta launched',
        'early traction',
        'steady revenues',
      ],
      required: true,
    },
    turnover: {
      type: Number,
      default: 0,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    url: String,
    pitchDeck: {
      pdfDoc: {
        type: String,
      },
      url: String,
    },
    gstin: Number,
    investmentRaised: Number,
  },
  {
    timestamps: true,
  }
);

const Startup = mongoose.model('Startup', StartupSchema);

export default Startup;
