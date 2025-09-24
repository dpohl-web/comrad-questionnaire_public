import { TESTACTION } from '../actions';

export default function test(state = 'testdefault', action) {
  switch (action.type) {
    case TESTACTION:
        state = action.hallo;
        
      return state;
    default:
      return state;
  }
}