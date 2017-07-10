import '@ngrx/store';
import { Actions } from './actions';
import { EffectsSubscription } from './effects-subscription';

let effectsModule = angular.module('@ngrx/effects', ['@ngrx/store'])
  .factory('Actions', ['Dispatcher', (d) => new Actions(d)])
  .provider('EffectsSubscription', function() {
    let effects = [];
    this.run = function (effect) {
      effects.push(effect);
    };
    this.$get = ['Store', (Store) => new EffectsSubscription(Store, null, effects)];

    return this;
  });

export const EffectsModule = {
	module: effectsModule,
  name: effectsModule.name,
	effects: [],
	add(EffectsSubscription, effect) {
		EffectsModule.effects.push(effect);
		EffectsSubscription.addEffects(EffectsModule.effects);
	},
	run(effect) {
		EffectsModule.module = EffectsModule.module
		.service(effect.name, effect)
		.run(['EffectsSubscription', effect.name, EffectsModule.add]);
	}
};