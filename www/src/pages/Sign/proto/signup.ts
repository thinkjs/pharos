import { FormComponentProps } from 'antd/lib/form';
import SignupStore from '../store/signup'

export interface LoginFormProps extends FormComponentProps {
  signupStore: SignupStore
}