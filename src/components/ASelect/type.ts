import { IUser } from '../../types';

export interface IMultiSelect {
  options: IUser[];
  selected?: string;
  // eslint-disable-next-line no-unused-vars
  onSelect: (id: string) => void;
}
