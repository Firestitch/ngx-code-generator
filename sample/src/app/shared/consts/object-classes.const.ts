
import { ObjectClass } from '../enums';

export const ObjectClasses = [
  { name: 'Doc', value: ObjectClass.Doc, icon: 'description', abr: 'D', color: '#0266ff' },
  { name: 'Task', value: ObjectClass.Task, icon: 'assignment', abr: 'T', color: '#00cc33' },
  { name: 'File', value: ObjectClass.File, icon: 'insert_drive_file', abr: 'F' },
  { name: 'Account', value: ObjectClass.Account, icon: 'person', abr: 'A' },
  { name: 'Asset', value: ObjectClass.Asset, icon: 'photo', abr: 'I', color: '#ff0100' },
  { name: 'Asset', value: ObjectClass.Image, icon: 'photo', abr: 'I', color: '#ff0100' },
  { name: 'Tag', value: ObjectClass.Tag, icon: 'person' },
  { name: 'Type', value: ObjectClass.Type, icon: 'person' },
  { name: 'Status', value: ObjectClass.Status, icon: 'person' },
  { name: 'Category', value: ObjectClass.Category, icon: 'person' },
  { name: 'Address', value: ObjectClass.Address, icon: 'person' },
  { name: 'Project', value: ObjectClass.Project, icon: 'person' }
];