import React, {
  useState, useEffect
} from 'react';

import PERT from './component';
import { Activity } from './logic';

const mock = [
  new Activity('A', 1, 2, 3, 100000, 0.5, 1, 2, 25000),
  new Activity('B', 4, 5, 6, 1000000, 3, 4, 5, 90000, 'A'),
  new Activity('C', 2, 3, 4, 500000, 1, 2, 3, 10000, 'A'),
  new Activity('D', 5, 6, 7, 900000, 4, 5, 6, 81000, 'B', 'C'),
  new Activity('E', 3, 4, 5, 700000, 2, 3, 4, 85000, 'D')
];
export default function PERTContainer() {
  const [normalPerti, setNormalPerti] = useState();

  return (<div>
    <PERT initialData={mock} Perti={normalPerti} setPerti={setNormalPerti} />
  </div>);
}
