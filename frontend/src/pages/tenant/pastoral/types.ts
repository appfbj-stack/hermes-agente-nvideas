
export enum MaritalStatus {
  Single = 'Solteiro(a)',
  Married = 'Casado(a)',
  Widowed = 'Viúvo(a)',
  Divorced = 'Divorciado(a)',
}

export enum EcclesiasticalOffice {
  Pastor = 'Pastor(a)',
  Presbyter = 'Presbítero(a)',
  Evangelist = 'Evangelista',
  Deacon = 'Diácono/Diaconisa',
  Missionary = 'Missionário(a)',
  WorshipMinistry = 'Ministério de Louvor',
  Member = 'Membro',
}

export enum PatrimonioStatus {
  Good = 'Bom',
  Maintenance = 'Em Manutenção',
  Broken = 'Quebrado',
}

export enum PastoralEventType {
  Visit = 'Visita',
  Meeting = 'Reunião',
  Counseling = 'Aconselhamento',
  Event = 'Evento Especial',
  Personal = 'Compromisso Pessoal',
}

export enum FestivityName {
  UFEBRAC = 'UFEBRAC',
  MINIBRAC = 'MINIBRAC',
  JUBRAC = 'JUBRAC',
  UMASBRAC = 'UMASBRAC',
  FAMI = 'FAMI',
  CEIA_REGIONAL = 'Ceia Regional',
}

export interface Member {
  id: string;
  fullName: string;
  address: string;
  phone: string;
  photo: string | null; // base64 string
  maritalStatus: MaritalStatus;
  cpf: string;
  ecclesiasticalOffice: EcclesiasticalOffice;
  baptismDate: string; // YYYY-MM-DD
  membershipDate: string; // YYYY-MM-DD
  hasCard: boolean;
  credentialValidity: string; // YYYY-MM-DD
  birthDate: string; // YYYY-MM-DD
  birthdayDate: string; // YYYY-MM-DD
  fatherName?: string;
  motherName?: string;
  childrenCount?: number;
  childrenNames?: string;
  educationLevel?: string;
  profession?: string;
}

export interface Service {
    id: string;
    date: string; // YYYY-MM-DD
    preacher: string;
    sermonTitle?: string;
    leader: string;
    observations: string;
}

export interface Sermon {
  id: string;
  title: string;
  theme: string;
  baseScripture: string;
  content: string;
  createdAt: string;
}

export interface Patrimonio {
  id: string;
  name: string;
  description: string;
  quantity: number;
  purchaseDate: string; // YYYY-MM-DD
  value: number;
  status: PatrimonioStatus;
  photo: string | null;
}

export interface PastoralAgendaEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  eventType: PastoralEventType;
  description: string;
  location: string;
}

export interface Task {
  id: string;
  date: string;
  title: string;
  description: string;
  completed?: boolean;
  color?: string;
}

export interface Festivity {
  id: string;
  name: FestivityName | string;
  date: string;
  leader: string;
  preacher: string;
  observations: string;
}

export interface Cell {
  id: string;
  name: string;
  leader: string;
  host: string;
  address: string;
  meetingDay: string;
  meetingTime: string;
  membersCount: number;
  observations: string;
}

export interface Visit {
  id: string;
  date: string;
  visitedPerson: string;
  visitor: string;
  reason: string;
  type: string;
  status: 'Realizada' | 'Pendente';
  observations: string;
}

export interface Wedding {
  id: string;
  date: string;
  groomName: string;
  brideName: string;
  location: string;
  officiant: string;
  observations: string;
}

export interface Counseling {
  id: string;
  date: string;
  personName: string;
  counselor: string;
  topic: string;
  status: 'Aberto' | 'Concluído';
  observations: string;
}

export interface FinanceEntry {
  id: string;
  date: string;
  description: string;
  type: 'Entrada' | 'Saída';
  category: string;
  amount: number;
  observations: string;
}

export type Tab = 'dashboard' | 'members' | 'services' | 'cells' | 'visits' | 'weddings' | 'counseling' | 'finance' | 'tasks' | 'festivities' | 'birthdays' | 'patrimonio' | 'sermons' | 'reports';
