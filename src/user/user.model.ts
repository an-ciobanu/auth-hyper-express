/*
	File for the user model
*/
import bcrypt from "bcrypt";
import { model, Schema, Document, Model } from "mongoose";

//We extend the mongoose.Document class with the data we need
interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: Date;
  emailVerified?: boolean;

  //comparePassword is a function that we will use to check passwords
  comparePassword(submitedPassword: string): boolean;
}

//We extend the Model with 2 more srtatic functions
//userAlreadyExists checks if the suer is in the DB
//findByEmail returns either the suer with the email or null
interface UserModel extends Model<IUser> {
  userAlreadyExists(email: string): boolean;
  findByEmail(email: string): IUser;
}

//We define the mongoose Schema for our database
const UserSchema = new Schema<IUser>({
  firstName: { type: String },
  lastName: { type: String },
  //Email is required, and must be unique
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  //password is required
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  emailVerified: { type: Boolean, default: false },
});

//We set up and index to make the findByEmail function run faster
UserSchema.index({ email: 1 });

//We define a virtual property, <fullName>
//OBSERVATION: currently not used
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

//The pre-save hook is used to hash the passwords
UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

/**
 * userAlreadyExists
 * 
 * @param email (string)
 * @returns true if a user with the specific email exista already in the DB
 * 			false other wise
 */
UserSchema.static(
  "userAlreadyExists",
  async function (email: string): Promise<boolean> {
    return (await this.countDocuments({ email })) != 0;
  }
);

/**
 * findByEmail
 * 
 * @param email (string)
 * @returns a user in the DB or null if no user with specific email exists
 */
UserSchema.static(
  "findByEmail",
  async function (email: string): Promise<IUser> {
    return await this.findOne({ email });
  }
);

/**
 * comparePassword
 * 
 * @param submitedPassword 
 * @returns true if the password submited by the user matches the one from the DB
 * 			false otherwise
 */
UserSchema.methods.comparePassword = function (
  submitedPassword: string
): boolean {
  return bcrypt.compareSync(submitedPassword, this.password);
};

const UserModel = model<IUser, UserModel>("User", UserSchema);

export { UserModel, IUser };
