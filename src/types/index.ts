export type UserStateType = 'online' | 'offline' | 'blocked';
export type MessageStateType = 'touched' | 'untouched';

export interface IUser {
  id: number;
  name: string;
  state: UserStateType;
}

export interface CreateMessageDto {
  authorId: number;
  toId: number;
  content: string;
}

export interface IMessage extends CreateMessageDto {
  id: number;
  state: MessageStateType;
  createdAt: string;
}
