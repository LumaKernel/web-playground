.PHONY: lint
lint: lint-eclint
	-npx -q prettier $$(fd --hidden "\.js\$$") --write
	-npx -q eslint $$(fd --hidden "\.js\$$") --fix

.PHONY: lint-eclint
lint-eclint:
	-npx -q eclint fix $$(fd --hidden --exclude .git)
