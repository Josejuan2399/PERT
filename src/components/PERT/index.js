import React, {
    useState, useEffect
} from 'react';

import PERT from './component';
import {Activity} from './functions/logic';

const mock = [
    new Activity('A', 1, 2, 3, 100000),
    new Activity('B', 4, 5, 6, 1000000, 'A'),
    new Activity('C', 2, 3, 4, 500000, 'A'),
    new Activity('D', 5, 6, 7, 900000, 'B', 'C'),
    new Activity('E', 3, 4, 5, 700000, 'D')
  ]
  
  const reducedMock = [
    new Activity('A', 0.5, 1, 2, 25000),
    new Activity('B', 3, 4, 5, 90000, 'A'),
    new Activity('C', 1, 2, 3, 10000, 'A'),
    new Activity('D', 4, 5, 6, 81000, 'B', 'C'),
    new Activity('E', 2, 3, 4, 85000, 'D')
  ]

export default function PERTContainer() {
    return (<div>
        <PERT reduced={false} initialData={mock} />
        <PERT reduced={true} initialData={reducedMock} />
    </div>)
}
