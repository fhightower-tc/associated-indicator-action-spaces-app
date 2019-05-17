help:
	@echo "pack 	package the app"

pack:
	# remove the old app
	rm -f TCX_-_Associated_Indicator_Operations_App.zip
	# copy the app into a new directory
	cp -r ./TCX_-_Associated_Indicator_Operations_App TCX_-_Associated_Indicator_Operations_App_app
	# zip the app (do it recursively (-r) and ignore any hidden mac files like '_MACOSX' and '.DS_STORE' (-X))
	zip -r -X TCX_-_Associated_Indicator_Operations_App.zip TCX_-_Associated_Indicator_Operations_App_app
	# remove the copy of this package
	rm -rf TCX_-_Associated_Indicator_Operations_App_app
	@echo "App has been packaged here: TCX_-_Associated_Indicator_Operations_App.zip"
