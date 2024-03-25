import MainHeader from './components/navigation/MainHeader'
import TaskList from './components/task/TaskList'
import { TaskStatus } from './utils/interfaces'
import { TaskContextProvider } from './context/context-provider'
import '../public/styles/index.css'

/**
 * Page for rendering main app
 * @returns {React.JSX.Element} MainHeader, TaskList
 */
function App() {
  return (
    <TaskContextProvider>
      <MainHeader />

      <main id='task-container'>
        <div id='today-tasks'>
          <h3>Today's Tasks</h3>
          <div className='scroller' id='today'>
            <TaskList listStatus={TaskStatus.Today} />
          </div>
        </div>

        <div id='task-side-panel'>
          <div id='pending-tasks'>
            <h3>Pending Tasks</h3>
            <div className='scroller' id='pending'>
              <TaskList listStatus={TaskStatus.Pending} />
            </div>
          </div>

          <div id='completed-tasks'>
            <h3>Completed Tasks</h3>
            <div className='scroller' id='completed'>
              <TaskList listStatus={TaskStatus.Completed} />
            </div>
          </div>
        </div>
      </main>

    </TaskContextProvider>
  )
}

export default App
