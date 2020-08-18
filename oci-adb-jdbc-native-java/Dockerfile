FROM fnproject/fn-java-fdk-build:latest as build
LABEL maintainer="tomas.zezula@oracle.com"
WORKDIR /function
ENV MAVEN_OPTS=-Dmaven.repo.local=/usr/share/maven/ref/repository
ADD pom.xml pom.xml
RUN ["mvn", "package", "dependency:copy-dependencies", "-DincludeScope=runtime", "-DskipTests=true", "-Dmdep.prependGroupId=true", "-DoutputDirectory=target"]
ADD src src
RUN ["mvn", "package"]

FROM fnproject/fn-java-native:latest as build-native-image
LABEL maintainer="tomas.zezula@oracle.com"
WORKDIR /function
COPY --from=build /function/target/*.jar target/
COPY --from=build /function/src/main/conf/reflection.json reflection.json
COPY --from=build /function/src/main/conf/jni.json jni.json
RUN /usr/local/graalvm/bin/native-image \
    --static \
    --no-fallback \
    --enable-all-security-services \
    --allow-incomplete-classpath \
	--initialize-at-build-time=oracle.jdbc.driver.DynamicByteArray,oracle.sql.ConverterArchive,oracle.sql.converter.CharacterConverterJDBC,oracle.sql.converter.CharacterConverter1Byte \
	--initialize-at-run-time=com.fnproject.fn.runtime.ntv.UnixSocketNative,java.sql.DriverManager \
    -H:Name=func \
    -H:IncludeResourceBundles=oracle.net.mesg.Message \
    -H:ReflectionConfigurationFiles=reflection.json \
    -H:JNIConfigurationFiles=jni.json \
    -classpath "target/*"\
    com.fnproject.fn.runtime.EntryPoint

FROM busybox:glibc
LABEL maintainer="tomas.zezula@oracle.com"
WORKDIR /function
COPY --from=build-native-image /function/func func
COPY --from=build-native-image /function/runtime/lib/* .
ENTRYPOINT ["./func", "-XX:MaximumHeapSizePercent=80"]
CMD [ "com.example.fn.TransferEventToADB::handleRequest" ]
