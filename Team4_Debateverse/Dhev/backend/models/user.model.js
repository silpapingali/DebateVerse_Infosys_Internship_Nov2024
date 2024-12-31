import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
			unique: true,
		},
		role: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ['active', 'suspended'],
			default: 'active'
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		debates: {
			type: Number,
			default: 0
		  },
		  likes: {
			type: Number,
			default: 0
		  },
		  votes: {
			type: Number,
			default: 0
		  },
		  joinedDate: {
			type: Date,
			default: Date.now
		  },
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
