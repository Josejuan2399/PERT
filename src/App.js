import React, {
  useState
} from 'react';

// STYLES
import './App.css';

// HELPERS
import { calculateTotalCost, calculateTotalDuration, calculateCriticalPath, Activity, calculateBudget } from './logic.js';


// COMPONENTS
import { Results } from './components/Results.js';
import { Form } from './components/Form.js';

let sampleData = [
  new Activity("A", 10, 100000),
  new Activity("B", 5, 500000),
  new Activity("C", 1, 1000000, "A", "B"),
  new Activity("D", 9, 2000000, "C"),
  new Activity("E", 7, 800000, "C"),
  new Activity("F", 1, 1500000, "D", "E"),
  new Activity("G", 4, 600000, "D", "E")
];

let flatActivitiesDone = [];
let groupedActivitiesDone = [[]];
let sampleAdminExpenses = 50000;

function App() {
  let [data, setData] = useState(sampleData);
  let [adminExpenses, setExpenses] = useState(sampleAdminExpenses);
  let [cost, setCost] = useState(0);
  let [duration, setDuration] = useState(0);
  let [criticalPath, setCriticalPath] = useState([]);
  let [budget, setBudget] = useState([]);
  let [wasCalculated, setCalc] = useState(false);

  const handleData = (data) => {
    setDuration(calculateTotalDuration(data, groupedActivitiesDone, flatActivitiesDone));
    setCost(calculateTotalCost(data, duration, adminExpenses));
    setCriticalPath(calculateCriticalPath(groupedActivitiesDone));
    setBudget(calculateBudget(groupedActivitiesDone, adminExpenses));
    setCalc(true);
  }

  const setDataThroughChildren = (newData) => {
    setData(newData);
  }

  return (
    <div className="App">
      <Form onSubmit={handleData} setData={setDataThroughChildren} data={data} />
      {wasCalculated && <div>
        <div className="horizontal-divisor"></div>
        <Results duration={duration} cost={cost} criticalPath={criticalPath} budget={budget} />
      </div>}
    </div>
  );
}

export default App;
