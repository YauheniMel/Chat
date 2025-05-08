import { CreateMessageDto, IMessage } from '../../types';

export type AlignmentType = 'markdown' | 'textarea';

export interface IEditor {
  // eslint-disable-next-line no-unused-vars
  submit: (message: CreateMessageDto) => Promise<IMessage>;
  alignment: AlignmentType;
}
