import { IsNotEmpty, MinLength, IsNumber, Allow, IsEmail } from 'class-validator'

export class Kitten {

  @Allow()
  public _id: string

  @IsNotEmpty()
  @MinLength(2)
  @IsEmail()
  public name: string

  @IsNumber()
  public something?: number = 0

}

