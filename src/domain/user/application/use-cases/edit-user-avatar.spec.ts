import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakeUploader } from 'test/storage/fake-uploader';
import { EditUserAvatarUseCase } from './edit-user-avatar';
import { User } from '../../enterprise/entities/user';
import { Name } from '../../enterprise/entities/value-objects/Name';
import { InvalidAvatarType } from './errors/invalid-avatar-type';

describe('Edit User Avatar Use Case', () => {
  let fakeUploader: FakeUploader;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let sut: EditUserAvatarUseCase;

  beforeEach(() => {
    fakeUploader = new FakeUploader();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new EditUserAvatarUseCase(inMemoryUsersRepository, fakeUploader);
  });

  it('should be able upload an avatar image', async () => {
    const user = User.create({
      name: Name.create({
        firstName: 'John',
        lastName: 'Doe',
      }),
      email: 'johndoe@example.com',
      password: '123456',
    });

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(
      expect.objectContaining({
        user: inMemoryUsersRepository.users[0],
      }),
    );
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    );
  });

  it('Should not be able to upload attachment with invalid file type', async () => {
    const user = User.create({
      name: Name.create({
        firstName: 'John',
        lastName: 'Doe',
      }),
      email: 'johndoe@example.com',
      password: '123456',
    });

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      fileName: 'profile.mp3',
      fileType: 'aduio/mpeg',
      body: Buffer.from(''),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAvatarType);
  });
});
