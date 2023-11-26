import React from 'react';
import logo from './logo.svg';
import './App.css';
import GriddedDotsDemonstration from "./components/GriddedDotsDemonstration";
import GravityDemonstration from "./components/GravityDemonstration";
import {IEntity} from "./models/entity";
import GravityDemonstrationWorker from "./components/GravityDemonstrationWorker";
import {createSolarSystem} from "./utils/system";

function App() {
    const $objects = React.useRef<IEntity[]>(createSolarSystem(1000));


  return (
    <div>
        <GravityDemonstrationWorker $objects={$objects} />
      <GravityDemonstration $objects={$objects}/>
    </div>
  );
}

export default App;
