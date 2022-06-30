import AppHeader from '../appHeader/AppHeader';
import WorkersList from '../workersList/WorkersList';
import NewWorkerForm from '../newWorkerForm/NewWorkerForm';

function App() {
  return (
    <div className="App">
      <AppHeader/>
      <WorkersList/>
      <NewWorkerForm/>
    </div>
  );
}

export default App;
