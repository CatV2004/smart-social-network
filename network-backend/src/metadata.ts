/* eslint-disable */
export default async () => {
  const [
    userEntityModule,
    signInDtoModule,
    appControllerModule,
    authControllerModule,

  ] = await Promise.all([
    import('@/modules/users/entities/user.entity'),
    import('@/modules/auth/dto/sign-in.dto'),
    import('@/app.controller'),
    import('@/modules/auth/auth.controller'),
    import('@/modules/users/users.controller'),
  ]); 

  return {
    '@nestjs/swagger': {
      models: [
        [
          userEntityModule,
          {
            User: {
              id: { required: true, type: () => String },
              email: { required: true, type: () => String },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
            },
          },
        ],
        [
          signInDtoModule,
          {
            SignInDto: {
              email: { required: true, type: () => String, maxLength: 255 },
              password: {
                required: true,
                type: () => String,
                minLength: 8,
                maxLength: 20,
                pattern:
                  '/((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/',
              },
            },
          },
        ],
      ],
      controllers: [
        [
          appControllerModule,
          { AppController: { getHello: { type: String } } },
        ],
        [
          authControllerModule,
          { AuthController: { signUp: {}, signIn: {}, signOut: {} } },
        ],
      ],
    },
  };
};
