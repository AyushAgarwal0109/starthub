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
    description: {
      type: String,
      required: true,
    },
    inceptionDate: {
      type: String,
      required: true,
    },
    existenceYears: Number,
    type: {
      type: String,
      default: 'private limited company',
      required: true,
    },
    sector: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      default: 'idea stage',
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
    gstin: String,
    investmentRaised: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Startup = mongoose.model('Startup', StartupSchema);

export default Startup;
