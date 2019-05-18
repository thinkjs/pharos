import { FormComponentProps } from 'antd/lib/form';
import SigninStore from '../store/signin'

// export interface CategoryProps {
//   categoryStore: CategoryStore;
// }

export interface LoginFormProps extends FormComponentProps {
  signinStore: SigninStore
}