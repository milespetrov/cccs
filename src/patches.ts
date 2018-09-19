import { EnhancedWindow } from '@/api';

// monkey-patch WET's escape function for jQuery selectors
// the original function did not escape `?` which are present in the router paths.
// selector.replace(/([;&,\.\+\*\~':"\\\!\^\/#$%@\[\]\(\)=>\|])/g, "\\$1" )
(<EnhancedWindow>window).wb.jqEscape = (selector: string) =>
    selector.replace(/([;&,\?\.\+\*\~':"\\\!\^\/#$%@\[\]\(\)=>\|])/g, '\\$1');
