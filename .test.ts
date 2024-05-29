import CodeBox from './codebox';
import { expect, test } from "bun:test";

test("CodeBox API", async () => {
  const codebox = new CodeBox();
  let sessionStarted = false;

  try {
    await codebox.start();
    sessionStarted = true;

    const runResult = await codebox.run("print('Hello World!')");
    expect(runResult?.content).toBe("Hello World!\n");

    const fileName = "test_file.txt";
    expect(await codebox.upload(fileName, "Hello World!")).toEqual(
      { status: "Successfully uploaded " + fileName }
    );

    expect(await codebox.listFiles()).toEqual(
      { files: [fileName] }
    );

    expect(await codebox.download(fileName)).toBe("Hello World!");

    const packageName = "matplotlib";
    expect(await codebox.install(packageName)).toEqual(
      { status: "Successfully installed " + packageName }
    );
    
    const code = "import matplotlib; print(matplotlib.__version__)";
    expect((await codebox.run(code))?.type).toBe(
      "text"
    );

    const bad_code = "prinnnnt('this should raise')";
    expect((await codebox.run(bad_code))?.type).toBe(
      "error"
    );

    const o = await codebox.run(
      "import matplotlib.pyplot as plt;"
      + "plt.plot([1, 2, 3, 4], [1, 4, 2, 3]); plt.show()"
    );
    expect(o?.type).toBe("image/png");
  } finally { if (sessionStarted) { await codebox.stop() } }
}, 42000);
