import { IsNotEmpty, MinLength, IsNumber, Allow } from 'class-validator'

export class Kitten {

  @Allow()
  public _id: string

  @IsNotEmpty()
  @MinLength(2)
  public name: string

  @IsNumber()
  public something?: number = 0

}

