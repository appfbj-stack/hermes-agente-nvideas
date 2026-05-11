import type {
  Member, Service, Patrimonio, PastoralAgendaEvent, Task,
  Festivity, Sermon, Cell, Visit, Wedding, Counseling, FinanceEntry
} from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getLocal = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(`hermes_pastoral_${key}`);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const saveLocal = <T>(key: string, data: T[]): T[] => {
  localStorage.setItem(`hermes_pastoral_${key}`, JSON.stringify(data));
  return data;
};

export const getMembers = async (): Promise<Member[]> => { await delay(100); return getLocal('members'); };
export const saveMembers = async (data: Member[]) => { await delay(100); return saveLocal('members', data); };

export const getServices = async (): Promise<Service[]> => { await delay(100); return getLocal('services'); };
export const saveServices = async (data: Service[]) => { await delay(100); return saveLocal('services', data); };

export const getSermons = async (): Promise<Sermon[]> => { await delay(100); return getLocal('sermons'); };
export const saveSermons = async (data: Sermon[]) => { await delay(100); return saveLocal('sermons', data); };

export const getPatrimonio = async (): Promise<Patrimonio[]> => { await delay(100); return getLocal('patrimonio'); };
export const savePatrimonio = async (data: Patrimonio[]) => { await delay(100); return saveLocal('patrimonio', data); };

export const getPastoralAgenda = async (): Promise<PastoralAgendaEvent[]> => { await delay(100); return getLocal('pastoral_agenda'); };
export const savePastoralAgenda = async (data: PastoralAgendaEvent[]) => { await delay(100); return saveLocal('pastoral_agenda', data); };

export const getTasks = async (): Promise<Task[]> => { await delay(100); return getLocal('tasks'); };
export const saveTasks = async (data: Task[]) => { await delay(100); return saveLocal('tasks', data); };

export const getFinance = async (): Promise<FinanceEntry[]> => { await delay(100); return getLocal('finance'); };
export const saveFinance = async (data: FinanceEntry[]) => { await delay(100); return saveLocal('finance', data); };

export const getFestivities = async (): Promise<Festivity[]> => { await delay(100); return getLocal('festivities'); };
export const saveFestivities = async (data: Festivity[]) => { await delay(100); return saveLocal('festivities', data); };

export const getCells = async (): Promise<Cell[]> => { await delay(100); return getLocal('cells'); };
export const saveCells = async (data: Cell[]) => { await delay(100); return saveLocal('cells', data); };

export const getVisits = async (): Promise<Visit[]> => { await delay(100); return getLocal('visits'); };
export const saveVisits = async (data: Visit[]) => { await delay(100); return saveLocal('visits', data); };

export const getWeddings = async (): Promise<Wedding[]> => { await delay(100); return getLocal('weddings'); };
export const saveWeddings = async (data: Wedding[]) => { await delay(100); return saveLocal('weddings', data); };

export const getCounseling = async (): Promise<Counseling[]> => { await delay(100); return getLocal('counseling'); };
export const saveCounseling = async (data: Counseling[]) => { await delay(100); return saveLocal('counseling', data); };
