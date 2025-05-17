import mongoose, { Schema } from "mongoose";
import { IUser, Roles } from "../types/IUser";

const userSchema: Schema<IUser> = new Schema<IUser>({
  username: { type: String, unique: true, sparse: true },
  email: { type: String, required: false, unique: true, sparse: true },
  password: { type: String, required: false, default: null },
  role: { type: [String], enum: Object.values(Roles), default: [Roles.USER] },
    // balance: { type: Number, default: 0 }, 
  // stripeCustomerId: { type: String }, 
  // transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  profile: {
      name: { type: String, default: null },
      bio: { type: String, default: null },
      avatar: { type: String, default: null },
    },
    refreshToken: { type: String, default: null },
    isVerified: { type: Boolean, required: false, default: false },
},
  { timestamps: true} 
);

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
