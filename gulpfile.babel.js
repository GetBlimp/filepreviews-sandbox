import s3 from 'gulp-s3'
import gulp from 'gulp'
import dotenv from 'dotenv'
import runSequence from 'run-sequence'

dotenv.load()

const AWS_CONFIG = {
  key: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: process.env.AWS_BUCKET,
  region: 'us-standard'
}

gulp.task('default', ['deploy'])

gulp.task('deploy', () => (
  gulp.src('./dist/**')
    .pipe(s3(AWS_CONFIG, {
      headers: { 'Cache-Control': 'max-age=604800, no-transform, public' },
      uploadPath: '/'
    }))
))
