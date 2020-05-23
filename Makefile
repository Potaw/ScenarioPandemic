all: clean install build adb
.PHONY: all

# clean untracked files
clean:
	git clean -ffdx

# install required nodejs packages parsing dependencies in package.json
DEPENDENCIES := $(shell node -e 'for (var k in require("./package.json").dependencies) {console.log(k.replace(/:/g, "-"));}')
install:
	npm install $(DEPENDENCIES)

init:
	./node_modules/.bin/androidjs init

# build the android apk
build:
	./node_modules/.bin/androidjs b -f --release

# install apk thru usb
adb:
	adb install -r dist/ScenarioPandemic.apk

# create targets parsing scripts in package.json (start...)
define npm_script_targets
TARGETS := $(shell node -e 'for (var k in require("./package.json").scripts) {console.log(k.replace(/:/g, "-"));}')
$$(TARGETS):
	npm run $(subst -,:,$(MAKECMDGOALS))
.PHONY: $$(TARGETS)
endef
$(eval $(call npm_script_targets))

