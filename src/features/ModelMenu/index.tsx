import isEqual from 'fast-deep-equal';

import { useGlobalStore } from '@/store/global';
import { modelProviderSelectors } from '@/store/global/selectors';

export const useModelList = () => {
  const modelList = useGlobalStore(modelProviderSelectors.modelList, isEqual);


};
