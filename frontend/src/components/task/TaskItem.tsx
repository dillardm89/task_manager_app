import Icon from '../elements/Icon'
import { type AppTaskType, type DBTaskType } from '../../utils/interfaces'
import '../../../public/styles/task-item.css'
import { useTaskContext } from '../../context/task-context'


/**
 * Props required for Task Item Component
 * @typedef {TaskItemProps}
 */
type TaskItemProps = {
    key: string, // key for mapping tasks on TaskList Component
    id: string,
    task: DBTaskType
}


/**
 * Component for rendering individual task items
 * Props passed down from TaskList component
 * @param {TaskItemProps} task DBTaskType object containing task data
 * @param {TaskItemProps} id string of task id
 * @returns {React.JSX.Element} TaskList
 */
export default function TaskItem({ task, id }: TaskItemProps) {
    const context = useTaskContext()
    const todayDate = new Date()
    const dueDate = (new Date((task.dueDate * 1000)))
    const dueDateString = dueDate.toDateString()
    const pastDue: boolean = (dueDate < todayDate)

    const appTask: AppTaskType = {
        name: task.name,
        summary: task.summary,
        dueDate: dueDateString,
        status: task.status
    }


    // Function to handle drag start event to move task between lists
    function handleDragStartEvent(event: React.DragEvent<HTMLLIElement>): void {
        context.dragStartHandler(event)
    }


    // Function to handle drag end event to move task between lists
    function handleDragEndEvent(event: React.DragEvent<HTMLLIElement>) {
        console.log(event)
    }


    return (
        <li id={id} draggable='true'
            onDragStart={handleDragStartEvent}
            onDragEnd={handleDragEndEvent}>

            <h4 id='task-name'>{appTask.name}</h4>

            <div id='task-info'>
                <p id='task-summary'>{appTask.summary}</p>

                <div id='task-bottombar'>
                    <p id={`${pastDue ? 'task-late' : 'task-date'}`}>
                        Due: {appTask.dueDate}
                    </p>

                    <div id='task-icons'>
                        <Icon type='edit' taskId={id} task={appTask} />
                        <Icon type='delete' taskId={id} task={appTask} />
                    </div>
                </div>
            </div>
        </li>
    )
}
