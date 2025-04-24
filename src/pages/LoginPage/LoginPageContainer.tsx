import React, { FC } from 'react';
import { connect } from 'react-redux';
import {
  createNameAction,
  loginUserThunk
} from '../../redux/reducers/auth-reducer';

import LoginPage from './LoginPage';

const LoginPageContainer: FC<any> = function ({ name, createName, login }) {
  return <LoginPage name={name} createName={createName} login={login} />;
};

const mapStateToProps = (state: any) => ({
  name: state.auth.name,
  isAuth: state.auth.isAuth
});
const mapDispatchToProps = (dispatch: any) => ({
  createName: (e: any) => {
    const { value } = e.currentTarget;

    return dispatch(createNameAction(value));
  },
  login: (value: string) => dispatch(loginUserThunk(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPageContainer);
