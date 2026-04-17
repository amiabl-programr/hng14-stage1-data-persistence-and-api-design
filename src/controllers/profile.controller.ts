import { Request, Response, NextFunction } from 'express';
import {
  createOrFetchProfile,
  getProfileById,
  listProfiles,
  removeProfile,
} from '../services/profile.service.js';

export const createProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ status: 'error', message: 'Name is required' });
    }

    if (typeof name !== 'string') {
      return res.status(422).json({ status: 'error', message: 'Name must be a string' });
    }

    const { profile, alreadyExists } = await createOrFetchProfile(name.trim().toLowerCase());

    if (alreadyExists) {
      return res.status(200).json({
        status: 'success',
        message: 'Profile already exists',
        data: formatProfile(profile),
      });
    }

    return res.status(201).json({
      status: 'success',
      data: formatProfile(profile),
    });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id }: any = req.params;
    const profile = await getProfileById(id);

    if (!profile) {
      return res.status(404).json({ status: 'error', message: 'Profile not found' });
    }

    return res.status(200).json({ status: 'success', data: formatProfile(profile) });
  } catch (err) {
    next(err);
  }
};

export const getProfiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gender, country_id, age_group } = req.query;

    const profiles = await listProfiles({
      gender: gender as string | undefined,
      country_id: country_id as string | undefined,
      age_group: age_group as string | undefined,
    });

    return res.status(200).json({
      status: 'success',
      count: profiles.length,
      data: profiles.map(formatProfileList),
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id }: any = req.params;
    const deleted = await removeProfile(id);

    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Profile not found' });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// Full profile shape
const formatProfile = (profile: any) => ({
  id: profile.id,
  name: profile.name,
  gender: profile.gender,
  gender_probability: profile.gender_probability,
  sample_size: profile.sample_size,
  age: profile.age,
  age_group: profile.age_group,
  country_id: profile.country_id,
  country_probability: profile.country_probability,
  created_at: profile.created_at,
});

// Slim profile shape for list endpoint
const formatProfileList = (profile: any) => ({
  id: profile.id,
  name: profile.name,
  gender: profile.gender,
  age: profile.age,
  age_group: profile.age_group,
  country_id: profile.country_id,
});
