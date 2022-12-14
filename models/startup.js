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
        name: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Investor',
        },
        investment: {
          type: Number,
        },
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
    availableStocks: {
      type: Number,
      default: 0,
    },
    currentStockPrice: {
      type: Number,
      default: 0,
    },
    stocksSold: {
      type: Number,
      default: 0,
    },
    investmentRaised: {
      type: Number,
      default: 0,
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
  },
  {
    timestamps: true,
  }
);

const Startup = mongoose.model('Startup', StartupSchema);

export default Startup;
