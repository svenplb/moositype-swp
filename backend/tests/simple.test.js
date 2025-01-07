import assert from 'assert';
import { TestResult } from '../models/TestResult.js';
import mongoose from 'mongoose';

// Simple test runner
async function runTests() {
  try {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
    
    console.log('Running tests...\n');
    
    // Test 1: Create test result
    const testData = {
      userId: '123',
      wpm: 65,
      cpm: 325,
      accuracy: 98,
      wordCount: 25
    };
    
    const result = await TestResult.create(testData);
    assert.strictEqual(result.wpm, 65, 'WPM should match');
    assert.strictEqual(result.accuracy, 98, 'Accuracy should match');
    console.log('✓ Test result creation passed');

    // Test 2: Validation error
    try {
      await TestResult.create({ wpm: 65 });
      assert.fail('Should have thrown validation error');
    } catch (error) {
      assert(error instanceof mongoose.Error.ValidationError);
      console.log('✓ Validation error test passed');
    }

    console.log('\nAll tests passed!');
  } catch (error) {
    console.error('\nTest failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

runTests();