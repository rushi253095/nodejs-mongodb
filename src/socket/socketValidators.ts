import { IsEnum, IsNotEmpty } from "class-validator";

// tslint:disable-next-line:no-namespace
export namespace Validator {
    export class ValidatorMapping {
        public mapping(eventName: string) {
            return {
                emitSignup: Signup,
            }[eventName];
        }
    }
    export class Signup {
        // Validation
        @IsNotEmpty()
        public name: string;
        @IsNotEmpty()
        @IsEnum(["Male", "Female"])
        public gender: string;
        @IsNotEmpty()
        public email: string;
        @IsNotEmpty()
        public mobile: string;
    }

}
