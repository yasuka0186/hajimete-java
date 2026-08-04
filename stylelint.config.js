export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'selector-class-pattern': [
      '^(?:[flcpu]-[a-z0-9]+(?:-[a-z0-9]+)*(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:--(?:[a-z0-9]+(?:-[a-z0-9]+)*))?|js-[a-z0-9]+(?:-[a-z0-9]+)*)$',
      {
        message: 'Expected a foundation/layout/component/project/utility BEM class name',
      },
    ],
  },
};
