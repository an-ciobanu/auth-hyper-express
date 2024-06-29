/*
	File for the user controller
*/

import dotenv from "dotenv";

import { Request, Response, Router } from "hyper-express";

import {
  SIGN_IN_ENDPOINT,
  SIGN_UP_ENDPOINT,
  SIGN_OUT_ENDPOINT,
  ERROR_GENERAL_SERVER,
  ERROR_USER_DOESNT_EXIST,
  ERROR_PASSWORD_IS_WRONG,
  ERROR_USER_ALREADY_EXISTS,
  ERROR_MISSING_PASSWORD_OR_EMAIL,
} from "../constants";

import {
  createToken,
  createUser,
  findByEmail,
  userAlreadyExists,
} from "./user.service";

// Setting up the config for the process envs
dotenv.config();

//Creating a router object
const router = new Router();

//Defining the sign up endpoint
router.post(SIGN_UP_ENDPOINT, async (req: Request, res: Response) => {
  try {
    //We get the email, password, first name and last name from the request
    //This data will be used to create a user in the DB
    const { email, password, firstName, lastName } = await req.json();

    //In case we do not have email or password (names are optional)
    if (!email || !password) {
      //We return a 400 error
      return res
        .status(400)
        .json({ error: true, description: ERROR_MISSING_PASSWORD_OR_EMAIL });
    }

    //If the email is already registered to a user
    if (await userAlreadyExists(email)) {
      //We return a 400 error
      return res
        .status(400)
        .json({ eror: true, description: ERROR_USER_ALREADY_EXISTS });
    }

    //createdUser is an object with the data of the created user, minus
    // the id, password and other private fields
    const createdUser = {
      firstName,
      lastName,
      email,
      emailVerified: false,
    };

    //We create the suer in the DB
    const user = await createUser({
      ...createdUser,
      password,
    });

    //We sue the createToken function to set a cookie on the client
    //and then we return the data for the suer we created
    return res.cookie("token", createToken(user)).status(200).json(createdUser);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ eror: true, description: ERROR_GENERAL_SERVER });
  }
});

//Defining the sign in endpoint
router.post(SIGN_IN_ENDPOINT, async (req: Request, res: Response) => {
  try {
    //We get the email and password from the request
    const { email, password } = await req.json();

    //If we do not have either email or password
    if (!email || !password) {
      //We can not sign in the user, we return a 400 error
      return res
        .status(400)
        .json({ error: true, description: ERROR_MISSING_PASSWORD_OR_EMAIL });
    }

    //We try to look for the user in the DB
    const user = await findByEmail(email);

    //If there is no user with that data
    if (!user) {
      //We return a 400 error. No user signed up with that data
      return res
        .status(400)
        .json({ error: true, description: ERROR_USER_DOESNT_EXIST });
    }

    //We check for the password
    if (!user.comparePassword(password)) {
      //if the passsword doesnt match, we return a 400 error
      return res
        .status(400)
        .json({ error: true, description: ERROR_PASSWORD_IS_WRONG });
    }

    //If we got here, all checks are good
    //User exists, password matches
    //We return the user data and we set the token cookie
    return res.cookie("token", createToken(user)).status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerified: user.emailVerified,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ eror: true, description: ERROR_GENERAL_SERVER });
  }
});

//Defining the sign out endpoint
router.post(SIGN_OUT_ENDPOINT, async (req: Request, res: Response) => {
  //If we have the token cookie set
  if (req.cookies["token"]) {
    //We clear it
    res.clearCookie("token");
  }
  res.json(true);
});

export default router;
