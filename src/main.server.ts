import 'zone.js'; // 👈 Add this line to satisfy server-side zone requirements
import { bootstrapApplication } from '@angular/platform-browser';
import { App} from './app/app';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;